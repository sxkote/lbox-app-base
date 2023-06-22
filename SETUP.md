# Setup Application

## Install Packages

### Install Translation packages: 
http://www.ngx-translate.com/

```shell 
npm install @ngx-translate/core@14.0.0 @ngx-translate/http-loader@7.0.0
```

### Instsall PrimeNG: 
https://primeng.org/installation

```shell 
npm install primeng@15.4.1 primeflex
```

### Install Bootstrap-Icons: 
https://icons.getbootstrap.com/

```shell
npm install bootstrap-icons
```

### Install Recaptcha (google): 
https://www.npmjs.com/package/ng-recaptcha

```shell 
npm install ng-recaptcha@11.0.0
```

### Install ESLint for Angular 
That would install `@angular-eslint/schematics@15.2.1` or higher
```shell
ng add @angular-eslint/schematics
```
Add packages for styling (linting):
```shell
npm install eslint-plugin-import eslint-config-airbnb-typescript --save-dev
```

## Setup ESLint

Modify `.eslintrc.json`:
```json lines
{
  // ...
  "ignorePatterns": [
    "projects/**/*",
    "src/environments/environment*.ts"
  ],
  "overrides": {
    // ...
    "parserOptions": { "project": ["tsconfig.(app|spec).json"] }, // !!! required
    "extends": [
      "eslint:recommended",
      "plugin:import/recommended",                                  // added
      "plugin:@typescript-eslint/recommended",
      "plugin:@angular-eslint/recommended",
      "plugin:@angular-eslint/template/process-inline-templates",
      "airbnb-typescript/base"                                      // added: Стайл гайд AirBnB
    ],
    "rules": {
      "@angular-eslint/directive-selector": [ ... ],
      "@angular-eslint/component-selector": [ ... ],
      "@angular-eslint/component-class-suffix": ["error", { "suffixes": [ "Component", "View" ] } ],
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/comma-dangle": [
        "error",
        {
          "arrays": "always-multiline",
          "objects": "always-multiline",
          "imports": "always-multiline",
          "exports": "never",
          "functions": "never"
        }
      ]
    }
  }
}
```



## Add MakeFile

```makefile
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
```

When Makefile is ready, we can install `lbox` libraries with `make install-lbox` command.

## Add Nginx.conf
`nginx.conf` will be used to launch ng application in Docker
```
events{}
http {
  include /etc/nginx/mime.types;
  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

## Add DockerFile

Dockerfile will be used to generate Docker Image to be uploaded on Docker Server

```dockerfile
#STAGE 1
FROM node:latest AS build
# install angular cli to run ng-build
WORKDIR /usr/src/app
RUN npm i @angular/cli

# copy all file to build the app
WORKDIR /usr/src
# copy LIBS to npm/ folder
COPY npm/lbox-shared.tgz npm/lbox-auth.tgz ./npm/
# copy package.json to app/ folder
COPY LBox.App.Base/package.json LBox.App.Base/package-lock.json ./app/
# run `npm install` in app/ folder
WORKDIR /usr/src/app
RUN npm install
COPY LBox.App.Base/. .
RUN npm run build-prod

#STAGE 2
FROM nginx:latest
COPY LBox.App.Base/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/lbox-app-base /usr/share/nginx/html
```

## Add .prettierrc
`.prettierrc` file needs to Prettier formatter work with WebStorm or any IDE 
```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "bracketSpacing": true,
  "printWidth": 120
}
```

----
# Styling with .scss and themes
We can add themes to the application (dark, light, etc):
1) Place main `styles.scss` file into `src/styles/` folder:
```scss
@import "bootstrap-icons/font/bootstrap-icons";
@import "primeng/resources/primeng.min.css";
@import "primeflex/primeflex";

@import "node_modules/lbox-shared/assets/styles/default";
```
2) Place themes (light, dark, etc.) `.scss` files into `src/styles/themes/` folder
```scss
@import "primeng/resources/themes/mdc-dark-indigo/theme.css";

body {
  // основной радиус для границ
  --theme-border-radius: 4px;
  // цвет границ
  --theme-color-border: var(--gray-100);
  // основной цвет фона
  --theme-color-background: rgb(18, 18, 18);
  // основной цвет кнопки
  --theme-color-primary: rgb(159, 168, 218); //0.92
  //// инверсионный цвет для основной кнопки
  //--theme-color-text-inverse: #121212;
  // главный цвет для заголовков и логотипа
  --theme-color-main: #646fcb; //rgba(41, 99, 173, 255);

  // цвет ошибки
  --theme-color-danger: var(--red-500);
}

.menu {
  border-color: var(--gray-500);

  .menu-link {
    color: var(--gray-100);

    &:hover {
      background-color: var(--gray-700) !important;
      color: #FFFFFF;
    }
  }
}
```
3) change `angular.json` file in `architect.build.options` block:
```json lines
{
  // "assets": ...
  "styles": [
    "src/styles/styles.scss",
    {
      "input": "src/styles/themes/mdc-light.scss",
      "bundleName": "theme-light",
      "inject": false
    },
    {
      "input": "src/styles/themes/mdc-dark.scss",
      "bundleName": "theme-dark",
      "inject": false
    }
    }
  }
  // "scripts": ...
```

----
# Building the Root Module

Config root module
```typescript
// loading translations
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/locale/', suffix: '.json' },
    { prefix: './assets/locale/lbox-shared/', suffix: '.json' },
    { prefix: './assets/locale/lbox-auth/', suffix: '.json' },
  ]);
}

// loading user's environment
export function configServiceFactory(configService: ConfigurationService) {
  return () => {
    configService.loadConfig();
  };
}

@NgModule({
    declarations: ...,
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        RootRoutingModule,
        HttpClientModule,
        TranslateModule.forChild({
            defaultLanguage: 'ru',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        LBoxSharedModule,
        LBoxAuthModule,
        ...
    ],
    providers: [
        //{ provide: APP_BASE_HREF, useValue: environment.baseHref },
        MessageService,
        {provide: TranslateStore},
        {
            provide: APP_INITIALIZER,
            useFactory: configServiceFactory,
            deps: [ConfigurationService],
            multi: true,
        },
        {provide: APP_CONFIGURATION, useValue: environment},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: RECAPTCHA_SETTINGS, useValue: {siteKey: environment.recaptcha.siteKey} as RecaptchaSettings},
    ],
    bootstrap: [AppView]
})
export class RootModule {}
```
