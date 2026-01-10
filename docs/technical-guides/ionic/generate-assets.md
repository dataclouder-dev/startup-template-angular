
### Assets means the icon, the splash and so on. 

The app uses a pluggin for that. 

https://capacitorjs.com/docs/guides/splash-screens-and-icons

YOu have to create in canva 2 projects, one with 1024x1024 and one with 2732x2732

icon-only: es el icono final.

foreground-icon: es el icono que se ve en la pantalla y debe llevar transparencia. mi archivo actual no tiene transparencia. 
como resultado se ve un fondo blanco. 

background-icon: es el fonde del icono. 

npx capacitor-assets generate --assetPath public/ionic-assets

Esto va a generar los iconos en los respectivos projects. de ios y android. 

