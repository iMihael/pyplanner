from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.template import RequestContext
from pyplanner import settings
from pyplanner.p_redis import PRedis
from django.http import HttpResponse


def plain(*args, **kwargs):
    response = HttpResponse(*args, **kwargs)
    if PRedis.cache_cookie:
        response.set_cookie(key='cache_cookie', value=PRedis.cache_cookie, max_age=604800)
    return response


def rsp(req, *args, **kwargs):
    kwargs['context_instance'] = RequestContext(req)
    args = (args[0] + settings.TEMPLATE_EXTENSION, args[1] if len(args) > 1 else {})
    response = render_to_response(*args, **kwargs)
    if PRedis.cache_cookie:
        response.set_cookie(key='cache_cookie', value=PRedis.cache_cookie, max_age=604800)
    return response


def rtr(*args, **kwargs):
    args = (args[0] + settings.TEMPLATE_EXTENSION, args[1] if len(args) > 1 else {})
    response = render_to_response(*args, **kwargs)
    if PRedis.cache_cookie:
        response.set_cookie(key='cache_cookie', value=PRedis.cache_cookie, max_age=604800)
    return response


def rts(*args, **kwargs):
    args = (args[0] + settings.TEMPLATE_EXTENSION, args[1] if len(args) > 1 else {})
    return render_to_string(*args, **kwargs)
