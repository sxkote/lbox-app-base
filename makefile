install-lbox:
	npm install ..\npm\lbox-shared.tgz && npm install ..\npm\lbox-auth.tgz

lint:
	ng lint

rebuild: lint
	ng build

docker-build: rebuild
	docker build -f "Dockerfile" -t lbox-base ../

docker-save:
	docker save --output "\\litnas\shared\docker-images\lbox-base.tar" lbox-base

deploy-docker: docker-build docker-save
