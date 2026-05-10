from flask import Flask, request, jsonify
from flask_cors import CORS

from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)

CORS(app)

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    expenses = data.get("expenses", [])

    expenses = [
        float(x)
        for x in expenses
    ]

    if len(expenses) < 2:

        return jsonify({
            "prediction": 0
        })

    X = np.array(
        range(len(expenses))
    ).reshape(-1, 1)

    y = np.array(expenses)

    model = LinearRegression()

    model.fit(X, y)

    next_month = np.array([
        [len(expenses)]
    ])

    prediction = model.predict(
        next_month
    )[0]

    return jsonify({
        "prediction":
        round(float(prediction), 2)
    })

if __name__ == "__main__":

    app.run(
        debug=True,
        port=8000
    )