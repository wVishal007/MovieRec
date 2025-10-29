from flask import Flask,render_template,send_from_directory,jsonify,request
import requests
from pydantic import BaseModel
from flask_cors import CORS
import joblib
import pandas as pd
import os
from dotenv import load_dotenv

#
movies_list = joblib.load('utils/moviesList.joblib')
similarity = joblib.load('utils/similarity.joblib')

#
load_dotenv()

headers = {
    "accept": "application/json",
    "Authorization": os.getenv('AUTH_TOKEN')
}

app = Flask(__name__,static_folder='client/dist/spa',static_url_path='')
CORS(app)

def fetchDetails(id):
    response = requests.get(
        f'https://api.themoviedb.org/3/movie/{id}?language=en-US',
        headers=headers
    )
    data = response.json()
    
    # If poster_path is missing, return a placeholder
    poster_path = data.get('poster_path')
    if poster_path:
        return f"http://image.tmdb.org/t/p/w500/{poster_path}"
    else:
        # Fallback poster image
        return "https://via.placeholder.com/500x750?text=No+Image"


@app.route('/')
def home():
    return send_from_directory(app.static_folder,'index.html')

@app.get('/movies')
def listMovies():
    data = movies_list.to_dict(orient='records')
    return jsonify(data)
    

@app.route('/recommend')
def suggest():
    movie = request.args.get('movie')
    if not movie:
        return jsonify({"error": "No movie provided"}), 400

    # find the movie index
    movie_index = movies_list[movies_list['title'] == movie].index[0]
    distances = similarity[movie_index]

    movies_indices = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x: x[1]
    )[1:6]

    recommended_movies = []
    for i in movies_indices:
        movie_id = movies_list.iloc[i[0]].movie_id
        details = fetchDetails(movie_id)
        recommended_movies.append({
            "title": movies_list.iloc[i[0]].title,
            "posterUrl": details
        })

    return jsonify(recommended_movies)

# @app.route("/home")
# def hello_world():
#     return send_from_directory(app.static_folder,'index.html')

if __name__ == "__main__":
    app.run(debug=True)

