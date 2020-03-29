.include <name.ini>

SERVICE != echo ${app_name}
REGGAE_PATH :=/usr/local/share/reggae
DEVEL_MODE = YES

build_lib:
	@sudo cbsd jexec jname=${SERVICE} /usr/src/bin/build.sh

publish: build_lib
	rsync -avl --delete-after --progress build/ designer.meka.rs:/usr/cbsd/jails-data/nginx-data/usr/local/www/designer.meka.rs

.include <${REGGAE_PATH}/mk/service.mk>
