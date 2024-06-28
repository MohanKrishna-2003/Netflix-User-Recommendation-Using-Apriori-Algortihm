import pandas as pd
from django.shortcuts import render
from apyori import apriori
from django.http import JsonResponse


def process_dataset(file):
    dataset = pd.read_csv(file, header=None)
    transactions = []
    for i in range(0, len(dataset)):
        transactions.append([str(dataset.values[i,j]) for j in range(0, 10)])

    rules = apriori(transactions = transactions, min_support = 0.003, min_confidence = 0.2, min_lift = 3, min_length = 2, max_length = 2)
    return list(rules)

def inspect(results):
    movie_1 = [tuple(result[2][0][0])[0] for result in results]
    movie_2 = [tuple(result[2][0][1])[0] for result in results]
    supports = [result[1] for result in results]
    return list(zip(movie_1, movie_2, supports))

def result(request):
    if request.method == 'POST':
        file = request.FILES['file']
        rules = process_dataset(file)
        results = inspect(rules)
        results_df = pd.DataFrame(results, columns=['Movie 1', 'Movie 2', 'Support'])
        results_df = results_df.nlargest(n=len(results_df), columns='Support')
        print(results_df)
        data = results_df.to_dict('records')  # Convert DataFrame to a list of dictionaries
        print(data)
        return JsonResponse({'results': data})
        # return JsonResponse({'results_df': list(results_df)})
        # return render(request, 'index.html', {'results_df': results_df.to_html(index=False)})
    return render(request, 'index.html')

