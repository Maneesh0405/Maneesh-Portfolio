"""
Velicheti Maneesh Chowdari - Portfolio (Single-Page Application)
"""

import os
from flask import Flask, render_template, redirect

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'maneesh-portfolio-secret-key-2026')

# ------------------------------------------------------------------------------
# SINGLE-PAGE PORTFOLIO ROUTE
# ------------------------------------------------------------------------------

@app.route('/')
def home():
    """Renders the Single-Page Portfolio with all 6 sections."""
    return render_template('index.html')

# Redirect legacy multi-page URLs to section anchors
@app.route('/about')
def legacy_about():
    return redirect('/#home')

@app.route('/education')
def legacy_education():
    return redirect('/#education')

@app.route('/skills')
def legacy_skills():
    return redirect('/#skills')

@app.route('/projects')
def legacy_projects():
    return redirect('/#projects')

@app.route('/certificates')
def legacy_certificates():
    return redirect('/#certificates')

@app.route('/achievements')
def legacy_achievements():
    return redirect('/#certificates')

@app.route('/contact')
def legacy_contact():
    return redirect('/#contact')

# ------------------------------------------------------------------------------
# NOTE: The site now uses static contact details only.
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# ERROR HANDLERS
# ------------------------------------------------------------------------------

@app.errorhandler(404)
def page_not_found(e):
    return redirect('/')

if __name__ == '__main__':
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
        use_reloader=False
    )
