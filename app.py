"""
Velicheti Maneesh Chowdari - Portfolio (Single-Page Application)
"""

import os
import re
import datetime
from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for

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
# RESUME & API ROUTES
# ------------------------------------------------------------------------------

@app.route('/resume')
def view_resume():
    """Serves the verified PDF resume directly in the browser for viewing."""
    return send_from_directory(
        'static/resume',
        'Maneesh_Resume.pdf'
    )

@app.route('/api/contact', methods=['POST'])
def api_contact():
    """Processes AJAX contact form submissions with input validation."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'success': False, 'message': 'Invalid JSON request payload.'}), 400

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    errors = {}
    if not name or len(name) < 2:
        errors['name'] = 'Name must be at least 2 characters long.'
    
    email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not email or not re.match(email_pattern, email):
        errors['email'] = 'A valid email address is required.'

    if not subject or len(subject) < 3:
        errors['subject'] = 'Subject must be at least 3 characters long.'

    if not message or len(message) < 10:
        errors['message'] = 'Message must be at least 10 characters long.'

    if errors:
        return jsonify({
            'success': False,
            'message': 'Validation failed. Please correct the highlighted errors.',
            'errors': errors
        }), 400

    # Log contact submission
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[CONTACT SUBMISSION - {timestamp}]")
    print(f"From: {name} <{email}>")
    print(f"Subject: {subject}")
    print(f"Message:\n{message}")
    print("-" * 50)

    return jsonify({
        'success': True,
        'message': f"Thank you, {name}! Your message has been sent successfully. I will get back to you shortly."
    }), 200

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
