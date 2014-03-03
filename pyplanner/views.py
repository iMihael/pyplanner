from pyplanner.wrappers import rtr
from django.shortcuts import redirect
from pyplanner.forms import LoginForm
from django.contrib import auth
from django.contrib.auth.decorators import user_passes_test


def index_page(request):
    view_params = {
        'username': request.user.username if request.user.is_authenticated() else False,
        'is_staff': request.user.is_staff,
    }
    return rtr('index', view_params)


@user_passes_test(lambda u: not u.is_authenticated(), 'dashboard.views.index', '')
def login_form(request):
    if 'login' in request.POST:
        lf = LoginForm(request.POST)
        if lf.is_valid():
            cd = lf.cleaned_data
            user = auth.authenticate(username=cd['username'], password=cd['password'])
            if user is not None and user.is_active:
                auth.login(request, user)
                if 'remember' not in request.POST:
                    request.session.set_expiry(0)
                if 'next' in request.GET:
                    return redirect(request.GET['next'])
                else:
                    return redirect('dashboard.views.index')
            else:
                lf.errors['username'] = True
    else:
        lf = LoginForm()

    return rtr('login-form', {'form': lf})


def logout_view(request):
    auth.logout(request)
    return redirect('pyplanner.views.index_page')


def logged_in(request):
    return redirect('dashboard.views.index')


def login_error(request):
    return redirect('pyplanner.views.index_page')


def blog(request):
    view_params = {
        'username': request.user.username if request.user.is_authenticated() else False,
    }
    return rtr('blog', view_params)


def about(request):
    view_params = {
        'username': request.user.username if request.user.is_authenticated() else False,
    }
    return rtr('about', view_params)


def contacts(request):
    view_params = {
        'username': request.user.username if request.user.is_authenticated() else False,
    }
    return rtr('contacts', view_params)