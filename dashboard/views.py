from pyplanner.wrappers import rtr, plain
from dashboard.models import Sticker, Color, Bgimage
from django.db.models import F, Max
from django.http import Http404
from dashboard.forms import StickerForm
from pyplanner.models import Config
from pyplanner.p_redis import PRedis
from datetime import datetime
import json
import urllib
import hashlib
import os.path


def index(request):
    try:
        ad_code = Config.objects.get(pk='adblock_code')
    except Config.DoesNotExist:
        ad_code = ''
    else:
        ad_code = ad_code.value

    view_params = {
        'username': request.user.username if request.user.is_authenticated() else False,
        'is_staff': request.user.is_staff,
        'ad_code': ad_code,
    }

    ### TODO: Fix this, main page must cache too!
    #PRedis.cache_init(request.user.id)
    #PRedis.client.setnx("page:" + PRedis.cache_cookie + ":" + request.get_full_path(),
    #                    rts('dashboard', view_params))

    return rtr('dashboard', view_params)


def snap(request, url):
    url = urllib.unquote(url)
    try:
        snap_service = Config.objects.get(pk='snap_service')
    except Config.DoesNotExist:
        return plain('Snap service is not set')
    else:
        snap_service = snap_service.value
        snap_service = snap_service.replace('{url}', url)
        h = hashlib.md5()
        h.update(url.encode('utf-8'))
        f_name = h.hexdigest()
        image_path = os.path.dirname(os.path.realpath(__file__)) + "/../pyplanner/media/img/" + f_name
        try:
            image = Bgimage.objects.get(pk=f_name)
        except Bgimage.DoesNotExist:
            image = Bgimage(name=f_name, url=url)
            try:
                urllib.urlretrieve(snap_service, image_path)
            except BaseException:
                return plain(0)

        try:
            handle = open(image_path, 'r+')
            content = handle.read()
            image.raw = content
            image.save()
        except IOError:
            if image.raw:
                content = image.raw
            else:
                return plain(0)

        PRedis.client.setnx("snap:" + f_name, content)
        response = plain(content, content_type='image')
        return response


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
        'username': request.user.username if request.user.is_authenticated() else False,
        'stickers': sticks,
        'is_staff': request.user.is_staff,
        'back': back_p,
        'next': next_p,
        'page': page,
    }
    return rtr('archive', view_params)


#def color(request):
#    if 'color_id' in request.GET:
#        try:
#            col = Color.objects.get(pk=request.GET['color_id'])
#        except Color.DoesNotExist:
#            raise Http404
#        else:
#            return HttpResponse(json.dumps({'color_id': col.color_id, 'name': col.name, 'hex_value': col.hex_value}))
#
#    try:
#        body = json.loads(request.body)
#    except ValueError:
#        raise Http404
#    else:
#        if 'color_id' in body and body['color_id'] == 0:
#            c_frm = ColorForm(body)
#            if c_frm.is_valid():
#                inst = c_frm.save()
#                return HttpResponse(
#                    json.dumps({'color_id': inst.color_id, 'name': inst.name, 'hex_value': inst.hex_value}))
#    raise Http404


def colors(request):
    cols = Color.objects.all()
    cols = list(cols.values('color_id', 'name', 'hex_value', 'font_color'))
    json_dump = json.dumps(cols)

    ### set cache for nginx
    PRedis.client.setnx("page:" + request.get_full_path(), json_dump)
    ###

    return plain(json_dump)


def stickers(request, page):
    per_page = 40
    offset = int(page) * per_page
    sticks = Sticker.objects.filter(owner=request.user, deleted__isnull=True,
                                    archived__isnull=True)[offset:offset + per_page]
    sticks = list(sticks.values('sticker_id', 'body', 'color_id', 'width', 'height', 'position'))
    json_dump = json.dumps(sticks)
    ### set cache for nginx
    PRedis.cache_init(request.user.id)
    PRedis.client.setnx("stickers:" + PRedis.cache_cookie + ":" + request.get_full_path(), json_dump)
    ###
    return plain(json_dump)


def sticker_restore(request, sticker_id):
    try:
        stick = Sticker.objects.get(pk=sticker_id, owner=request.user)
    except Sticker.DoesNotExist:
        raise Http404
    else:
        max_position = Sticker.objects.filter(owner=request.user).aggregate(Max('position'))
        stick.position = max_position['position__max'] + 1
        stick.archived = None
        stick.deleted = None
        stick.save()
        PRedis.clear_user_cache(request.user.id)
        return plain(1)
    return plain(0)


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
            PRedis.clear_user_cache(request.user.id)
            return plain(1)
    return plain(0)


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
            PRedis.clear_user_cache(request.user.id)
            return plain(1)
    return plain(0)


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
                PRedis.clear_user_cache(request.user.id)
                return plain(json.dumps(
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
                PRedis.clear_user_cache(request.user.id)

                return plain(json.dumps(
                    {'sticker_id': inst.sticker_id, 'body': inst.body, 'color_id': inst.color_id, 'width': inst.width,
                     'height': inst.height, 'position': inst.position}))
    raise Http404