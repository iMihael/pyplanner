from pyplanner.wrappers import rtr
from dashboard.models import Sticker, Color
from django.db.models import F
from django.http import HttpResponse, Http404
from dashboard.forms import ColorForm, StickerForm
from datetime import datetime
import json


def index(request):
    view_params = {
        'user_logged': request.user.is_authenticated(),
        'username': request.user.username if request.user.is_authenticated() else False,
    }
    return rtr('dashboard', view_params)


def archive(request, page):
    page = int(page)
    limit = 20
    offset = page * limit
    limit += offset
    sticks = Sticker.objects.filter(owner=request.user, deleted__isnull=True, archived__isnull=False).order_by('-archived')[offset:limit]
    count = Sticker.objects.filter(owner=request.user, deleted__isnull=True, archived__isnull=False).count()
    back_p = False
    next_p = False

    if limit < count:
        next_p = page+1

    if page > 0:
        back_p = page-1

    view_params = {
        'user_logged': request.user.is_authenticated(),
        'username': request.user.username if request.user.is_authenticated() else False,
        'stickers': sticks,
        'back': back_p,
        'next': next_p,
        'page': page,
    }
    return rtr('archive', view_params)


def color(request):
    if 'color_id' in request.GET:
        try:
            col = Color.objects.get(pk=request.GET['color_id'])
        except Color.DoesNotExist:
            raise Http404
        else:
            return HttpResponse(json.dumps({'color_id': col.color_id, 'name': col.name, 'hex_value': col.hex_value}))

    try:
        body = json.loads(request.body)
    except ValueError:
        raise Http404
    else:
        if 'color_id' in body and body['color_id'] == 0:
            c_frm = ColorForm(body)
            if c_frm.is_valid():
                inst = c_frm.save()
                return HttpResponse(
                    json.dumps({'color_id': inst.color_id, 'name': inst.name, 'hex_value': inst.hex_value}))
    raise Http404


def colors(request):
    cols = Color.objects.all()
    cols = list(cols.values('color_id', 'name', 'hex_value', 'font_color'))
    return HttpResponse(json.dumps(cols))


def stickers(request):
    sticks = Sticker.objects.filter(owner=request.user, deleted__isnull=True, archived__isnull=True)
    sticks = list(sticks.values('sticker_id', 'body', 'color_id', 'width', 'height', 'position'))
    return HttpResponse(json.dumps(sticks))


def sticker_restore(request, sticker_id):
    try:
        stick = Sticker.objects.get(pk=sticker_id, owner=request.user)
    except Sticker.DoesNotExist:
        raise Http404
    else:
        stick.archived = None
        stick.deleted = None
        stick.save()
        return HttpResponse(1)
    return HttpResponse(0)


def sticker_archive(request, sticker_id):
    try:
        stick = Sticker.objects.get(pk=sticker_id, owner=request.user)
    except Sticker.DoesNotExist:
        raise Http404
    else:
        if request.method == 'DELETE':
            Sticker.objects.filter(owner=request.user, position__gt=stick.position).update(position=F('position')-1)
            if not stick.body:
                stick.delete()
            else:
                stick.position = -1
                stick.archived = datetime.now()
                stick.save()
            return HttpResponse(1)
    return HttpResponse(0)


def sticker_update(request, sticker_id):
    try:
        stick = Sticker.objects.get(pk=sticker_id, owner=request.user)
    except Sticker.DoesNotExist:
        raise Http404
    else:
        if request.method == 'DELETE':
            Sticker.objects.filter(owner=request.user, position__gt=stick.position).update(position=F('position')-1)
            if not stick.body:
                stick.delete()
            else:
                stick.position = -1
                stick.deleted = datetime.now()
                stick.save()

            return HttpResponse(1)
    return HttpResponse(0)


def sticker(request):
    try:
        body = json.loads(request.body)
    except ValueError:
        raise Http404
    else:
        try:
            stick = Sticker.objects.get(pk=body['sticker_id'], owner=request.user)
        except Sticker.DoesNotExist:
            s_frm = StickerForm(body)
            if s_frm.is_valid():
                inst = s_frm.save(commit=False)
                inst.owner = request.user
                inst.save()

                return HttpResponse(json.dumps(
                    {'sticker_id': inst.sticker_id, 'body': inst.body, 'color_id': inst.color_id, 'width': inst.width,
                     'height': inst.height, 'position': inst.position}))
        else:
            old_position = stick.position
            s_frm = StickerForm(body, instance=stick)

            if s_frm.is_valid():
                if old_position != stick.position:
                    if stick.position < old_position:
                        Sticker.objects.filter(
                            owner=request.user, position__gte=stick.position, position__lte=old_position)\
                            .exclude(sticker_id=stick.sticker_id).update(position=F('position') + 1)
                    elif stick.position > old_position:
                        Sticker.objects.filter(
                            owner=request.user, position__lte=stick.position, position__gte=old_position)\
                            .exclude(sticker_id=stick.sticker_id).update(position=F('position') - 1)

                inst = s_frm.save(commit=False)
                inst.save()

                return HttpResponse(json.dumps(
                    {'sticker_id': inst.sticker_id, 'body': inst.body, 'color_id': inst.color_id, 'width': inst.width,
                     'height': inst.height, 'position': inst.position}))

    raise Http404