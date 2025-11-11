from flask import Flask, render_template
app = Flask(__name__)
@app.route('/')
def analytics_page():
  return render_template('analytics.html')
if __name__ == '__main__':
  app.run(debug=True, port=5001)