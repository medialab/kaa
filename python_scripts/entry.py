from flask import Flask, jsonify, request
import os
import json

app = Flask(__name__)


@app.route("/test")
def resp():
    return jsonify(
        test="response from python"
    )

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)