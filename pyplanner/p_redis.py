import redis


class PRedis:
    client = redis.StrictRedis()

    def __init__(self):
        pass

    def clear_stickers_cache(self):
        pass