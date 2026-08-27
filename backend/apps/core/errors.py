from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(response.data, dict) and "code" in response.data:
        return response

    response.data = {
        "code": default_error_code(response.status_code),
        "detail": response.data,
    }
    return response


def default_error_code(status_code: int) -> str:
    if status_code == 400:
        return "validation_error"
    if status_code == 401:
        return "authentication_required"
    if status_code == 403:
        return "permission_denied"
    if status_code == 404:
        return "not_found"
    if status_code == 405:
        return "method_not_allowed"
    return "api_error"


def error_response(code: str, *, status_code: int, **extra):
    from rest_framework.response import Response

    return Response(
        {
            "code": code,
            **extra,
        },
        status=status_code,
    )
