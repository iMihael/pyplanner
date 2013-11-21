from django.shortcuts import render_to_response
from django.template import RequestContext
from pyplanner import settings


def rsp(req, *args, **kwargs):
    kwargs['context_instance'] = RequestContext(req)
    args = (args[0] + settings.TEMPLATE_EXTENSION, args[1] if len(args) > 1 else {})
    return render_to_response(*args, **kwargs)


def rtr(*args, **kwargs):
    args = (args[0] + settings.TEMPLATE_EXTENSION, args[1] if len(args) > 1 else {})
    return render_to_response(*args, **kwargs)
