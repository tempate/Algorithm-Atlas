## Projects

In this repository I intend to keep track of some algorithms I've been learning throw the past year.
The code consists on a Django application that runs the algorithms, written in [p5.js](https://p5js.org/) (Processing) as static files.

The cryptography demos (AES, SHA-1 and RSA) are hand-written Python and run on the
server. Everything else is a p5.js sketch and runs in the browser.

There is no database. The list of projects lives in `index/catalog.py`, and the only
per-user state is the asymmetric-key demo's chat, kept in a signed cookie.

### Running the code

#### Install dependencies

1. Create a virtual environment
```
python -m venv venv
```

2. Activate the virtual environment
```
source venv/bin/activate
```

3. Install the requirements
```
pip install -r requirements.txt
```

#### Set up a secret key

4. Generate a secret key for Django
```
python gen_secret_key.py
```

5. Export the secret as an environment variable
```
export DJANGO_SECRET_KEY='your-secret-key'
```

Sessions are signed with this key, so changing it clears any chat in progress.

#### Launch the site

###### Development

Use this approach when launching the site locally in development. It is simpler and
automatically reloads the application when the code changes. `DJANGO_DEBUG` serves the
static files straight from the source tree and shows tracebacks in the browser.

```
DJANGO_DEBUG=1 python manage.py runserver 0.0.0.0:8080
```

###### Production

Use this approach when launching the site in production. It is faster, more scalable,
and designed to handle production loads. Leave `DJANGO_DEBUG` unset.

Collect the static files first. WhiteNoise compresses them and stamps a hash into each
filename, so this has to run again whenever a static file changes.

```
python manage.py collectstatic --noinput
gunicorn projects.wsgi:application --bind 0.0.0.0:8000
```

Whichever hostname the site is served under has to be in `ALLOWED_HOSTS` in
`projects/settings.py`. On Render, `RENDER_EXTERNAL_HOSTNAME` is picked up automatically.
