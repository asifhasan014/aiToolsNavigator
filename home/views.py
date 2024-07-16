from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import MasterData, RecommendationData
import pandas as pd

DATABASE = {
    'tool1': [{"name": "Tool 1 Rec 1", "use": "Use 1"}, {"name": "Tool 1 Rec 2", "use": "Use 2"}],
    'tool2': [{"name": "Tool 2 Rec 1", "use": "Use 1"}, {"name": "Tool 2 Rec 2", "use": "Use 2"}],
}


def home(request):
    allMasterData = MasterData.objects.all()
    size = allMasterData.count()
    print(size)
    if size == 0:
        insertDataIntoMasterTable()
        insertDataIntoRecommTable()
    return render(request, 'home/home.html')


def insertDataIntoMasterTable():
    df = pd.read_csv(settings.DATA_FILE_PATH)
    print(df.head(5))
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
    marks_list = df['Useable For']
    newDataList = dataClean(marks_list)
    if len(newDataList) == len(df):
        df['Useable For'] = newDataList
    df_filled = df.fillna(0)
    df_filled.columns = [
        'ai_tool_name', 'descriptions', 'payment_condition',
        'useable_for', 'charges', 'review', 'tool_link', 'major_category'
    ]
    for index, row in df_filled.iterrows():
        MasterData.objects.create(
            ai_tool_name=row['ai_tool_name'],
            descriptions=row['descriptions'],
            payment_condition=row['payment_condition'],
            useable_for=row['useable_for'],
            charges=row['charges'],
            review=row['review'],
            tool_link=row['tool_link'],
            major_category=row['major_category']
        )


def insertDataIntoRecommTable():
    queryset = MasterData.objects.all()

    # Convert queryset to DataFrame
    df = pd.DataFrame(list(queryset.values()))

    # Drop unnecessary columns
    df.drop(['payment_condition', 'charges', 'review', 'tool_link', 'major_category'], axis=1, inplace=True)

    # Verify the data before splitting
    print("DataFrame before splitting 'useable_for':")
    print(df.head())

    # Split 'useable_for' into multiple rows
    df['useable_for'] = df['useable_for'].str.split(',').apply(lambda x: [i.strip() for i in x])
    df = df.explode('useable_for', ignore_index=True)

    # Verify the data after splitting
    print("DataFrame after splitting 'useable_for':")
    print(df.head())

    for index, row in df.iterrows():
        master_data_instance = MasterData.objects.get(id=row['id'])  # Fetch the instance using the ID

        RecommendationData.objects.create(
            ai_tool_name=row['ai_tool_name'],
            descriptions=row['descriptions'],
            useable_for=row['useable_for'],
            master_data=master_data_instance  # Assign the instance, not just the ID
        )


def dataClean(marks_list):
    newDataList = []
    for val in marks_list:
        newValue = val.strip()
        if newValue.startswith('/'):
            newValue = newValue[1:]
            newValueArr = newValue.split("/")
            newVal = ""
            for val in newValueArr:
                newVal = newVal + "," + val.strip()
            if newVal.startswith(','):
                finalVal = newVal[1:]
                newDataList.append(finalVal)
    return newDataList


def charts(request):
    return render(request, 'home/charts.html')


def recommendation(request):
    return render(request, 'home/recommendation.html')


def get_recommendations(request):
    if request.method == 'POST':
        tool_name = request.POST.get('tool_name')
        if not tool_name:
            return JsonResponse({"error": "Tool name cannot be empty"}, status=400)

        queryset = MasterData.objects.all()
        df = pd.DataFrame(list(queryset.values()))

        if tool_name in df['ai_tool_name'].values:
            df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
            df['combined'] = df['descriptions'] + ' ' + df['useable_for']
            tfidf = TfidfVectorizer()
            tfidf_matrix = tfidf.fit_transform(df['combined'])
            cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
            recommendations = get_recommandValue(df,tool_name, cosine_sim)
            print(recommendations)
            return JsonResponse(recommendations, safe=False)
        else:
            return JsonResponse({"error": "Tool name not found in database"}, status=404)

def get_recommandValue(df,tool_name, cosine_sim):
    tools_dict = {}
    idx = df.index[df['ai_tool_name'] == tool_name][0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]  # Get top 5 recommendations
    tool_indices = [i[0] for i in sim_scores]

    for i in tool_indices:
        tool_name = df['ai_tool_name'].iloc[i]
        useable_for = df['useable_for'].iloc[i]

        if tool_name not in tools_dict:
            tools_dict[tool_name] = []

        tools_dict[tool_name].append({"name": tool_name, "use": useable_for})

    formatted_tools_dict = {f'tool{i + 1}': v for i, (k, v) in enumerate(tools_dict.items())}
    return formatted_tools_dict