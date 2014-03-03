import redis
import string
import random


class PRedis:
    client = redis.StrictRedis()
    cache_cookie = ''
    user_id = 0

    def __init__(self, user_id):
        pass

    @staticmethod
    def cache_init(user_id):
        PRedis.user_id = user_id
        PRedis.cache_cookie = PRedis.client.get('cache_cookie:' + str(user_id))
        if not PRedis.cache_cookie:
            PRedis.cache_cookie = PRedis.id_generator(size=8)
            PRedis.client.set('cache_cookie:' + str(PRedis.user_id), PRedis.cache_cookie)

    @staticmethod
    def clear_user_cache(uid=user_id):
        PRedis.cache_cookie = PRedis.id_generator(size=8)
        PRedis.client.set('cache_cookie:' + str(uid), PRedis.cache_cookie)

    @staticmethod
    def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))