.include <name.ini>

SYSPKG = YES
USE_FREENIT = YES
SERVICE != echo ${app_name}
REGGAE_PATH := /usr/local/share/reggae
DEVEL_MODE = YES

.include <${REGGAE_PATH}/mk/service.mk>
