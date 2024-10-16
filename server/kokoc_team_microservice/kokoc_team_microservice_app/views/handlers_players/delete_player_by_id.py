from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from ...models import Player

@swagger_auto_schema(
    method='delete',
    operation_description="Удаление игрока по его ID. Доступно только администраторам (is_superuser == true).",
    tags=["playerHandlers"],
    manual_parameters=[
        openapi.Parameter('id', openapi.IN_PATH, description="ID игрока", type=openapi.TYPE_INTEGER)
    ],
    responses={
        204: openapi.Response(description="Игрок успешно удален"),
        404: openapi.Response(description="Игрок не найден"),
        403: openapi.Response(description="Нет прав доступа"),
    }
)
@api_view(['DELETE'])
@authentication_classes([JWTTokenUserAuthentication])
@permission_classes([IsAuthenticated])
def delete_player_by_id(request, id):
    # Проверка прав администратора
    if not request.user.is_superuser:
        return Response({'error': 'У вас нет прав для удаления игроков'}, status=status.HTTP_403_FORBIDDEN)

    try:
        # Ищем игрока по id
        player = Player.objects.get(id=id)
        player.delete()  # Удаляем игрока
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Player.DoesNotExist:
        return Response({'error': 'Игрок не найден'}, status=status.HTTP_404_NOT_FOUND)
