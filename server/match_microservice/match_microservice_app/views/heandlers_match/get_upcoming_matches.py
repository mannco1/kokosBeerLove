from rest_framework.response import Response
from rest_framework.decorators import api_view
from ...models import Match
from ...serializers import MatchSerializer
from datetime import date
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    method='get',
    operation_description="Получение списка предстоящих матчей. Данные включают название команд, логотипы и другую информацию о матче.",
    responses={200: openapi.Response(
        description="Успешный ответ с данными предстоящих матчей",
        examples={
            "application/json": [
                {
                    "team_home": "Команда Х",
                    "team_away_name": "Команда Y",
                    "team_away_logo_url": "http://example.com/logo_y.jpg",
                    "score_home": 2,
                    "score_away": 1,
                    "location": "Стадион 1",
                    "division": "Премьер-лига",
                    "video_url": "http://example.com/match_video",
                    "match_date": "2024-10-09",
                    "match_time": "14:00:00"
                }
            ]
        }
    )}
)
@api_view(['GET'])
def get_upcoming_matches(request):
    # Фильтруем предстоящие матчи (match_date >= текущая дата)
    upcoming_matches = Match.objects.filter(match_date__gte=date.today()).order_by('match_date')
    serializer = MatchSerializer(upcoming_matches, many=True)
    return Response(serializer.data)
