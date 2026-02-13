### Esta debe ser una guia para enderder que hay detras de un modelo en sí. 

Para probar la mejor manera es descargar algunos. 



La mayoria los encuentro aqui. 


https://booth.pm/en/search/free%20live2d?max_price=0&sort=new


el archivo .model3.json es el que contiene la informacion del modelo. y el que cargo. 

Pero a veces tiene expresiones y motions. y phisics y otros archivos que no entiendo todos. 


Creo que el estandar es que no lo traiga, y el programa lea los archivos para saber que existe. 


Why Motions and Expressions Aren't Listed
Motions and expressions are typically stored in separate JSON files in the downloaded zip. They're not referenced in the main model3.json because:

They're optional - The model can display without them
They're loaded dynamically - Applications load them when needed, not at initialization
Flexibility - You can add/remove motions and expressions without modifying the core model file

Where to Find Them
In your downloaded zip, look for:

Motions folder - Contains .motion3.json files (animations)
Expressions folder - Contains .exp3.json files (facial expressions)


### Como mi playground necesita leerlos para cargarlos. 

Se los agrego manualmente al archivo model3.json. con la ayuda de AI. que lea el folder. 