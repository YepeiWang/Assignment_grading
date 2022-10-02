from cProfile import label
import pandas as pd
from sklearn.metrics import confusion_matrix
from sentence_transformers import SentenceTransformer
from sklearn.cluster import AgglomerativeClustering
from sklearn.decomposition import PCA
# import matplotlib.pyplot as plt
from sklearn.manifold import TSNE 
from sentence_transformers import util
import heapq
import json
import sys

model = SentenceTransformer('all-MiniLM-L6-v2')




def cluster(distance):
    df = pd.read_csv('../data/test.csv', header = 0, sep = ",")
    answers = df.iloc[:,1]
    student_id = df.iloc[:,0]
    sentences = []
    for answer in answers:
        sentences.append(answer)
    bert_embeddings = model.encode(answers)
    clustering_model = AgglomerativeClustering(n_clusters=None, distance_threshold=distance)

    clustering_model.fit(bert_embeddings)
    bert_label = clustering_model.labels_


    df_clusters = pd.DataFrame({
        "id": student_id,
        "text": answers,
        "agg_bert_row": bert_label,
    })
    embedding_list = []
    for i in bert_embeddings:
        embedding_list.append(i)

  
    length = []
    for i in range(0,len(student_id)):
        answer_length = len(answers[i])
        length.append(answer_length)
    df_clusters["answer_length"] = length

    X_embedded = TSNE(n_components=2).fit_transform(embedding_list)
    vector_2 = pd.DataFrame(X_embedded)
    df_clusters["x_position"] = vector_2.iloc[:,0]
    df_clusters["y_position"] = vector_2.iloc[:,1]

    # plt.scatter(X_embedded[:, 0], X_embedded[:, 1], s=length, c=bert_label, cmap='tab20')
    # plt.title("Dim=2")
    # plt.colorbar()
    # plt.savefig('data/cluster_3.png')

    clusters = {}
    groups = {}
    for i in range(0,len(student_id)):
        i_cluster = bert_label[i]
        if i_cluster not in clusters:
            groups[i_cluster] = 1
            clusters[i_cluster] = bert_embeddings[i]
        else:
            groups[i_cluster] +=1
            clusters[i_cluster] = clusters[i_cluster] + bert_embeddings[i]
    # center of the cluster       
    for key in clusters:
        clusters[key] = clusters[key]/groups[key]

    distant_point = {}
    distant_point_id = {}
    for i in range(0, len(student_id)):
        i_cluster = bert_label[i]
        cos_sim = util.cos_sim(bert_embeddings[i], clusters[i_cluster])
        if i_cluster not in distant_point:
            distant_point[i_cluster] = cos_sim
            distant_point_id[i_cluster] = i
        else:
            if(cos_sim < distant_point[i_cluster]):
                distant_point[i_cluster] = cos_sim
                distant_point_id[i_cluster] = i

    influenced_points = {}
    for key in distant_point_id:
        id = distant_point_id[key]
        if(distant_point[key]<0.85):
            key_similarity_list = []
            for i in range(0,len(student_id)):
                cos_sim = util.cos_sim(bert_embeddings[id], bert_embeddings[i])
                key_similarity_list.append(cos_sim)
            influenced_points[key] = key_similarity_list
    most_similar = {}
    for key in influenced_points:
        max_index = []
        max_number = heapq.nlargest(6,influenced_points[key]) 
        for t in max_number:
            index = influenced_points[key].index(t)
            max_index.append(index)
            influenced_points[key][index] = 0
        most_similar[key] = max_index
    most_similar_answer = {}
    for key in most_similar:
        similar_answers = []
        for i in most_similar[key]:
            similar_answer = answers[i]
            similar_answers.append(similar_answer)
        most_similar_answer[key] = similar_answers

    js_simlar_id = json.dumps({str(k):  most_similar[k] for k in  most_similar})  
    file = open('../data/most_similar_5_id_3.json', 'w')
    file.write(js_simlar_id)

    js_simlar_text = json.dumps({str(k):  most_similar_answer[k] for k in  most_similar_answer})  
    file = open('../data/most_similar_5_answer_3.json', 'w')
    file.write(js_simlar_text)
    
    df_clusters.to_csv("../data/cluster_3.csv")
    return df_clusters

def main(argv):
    distance = float(argv[1])
    cluster(distance)

if __name__ == "__main__":
    main(sys.argv)
