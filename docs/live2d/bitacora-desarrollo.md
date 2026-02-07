### 8/Ago/2025

I found a library that makes easy to work the lib-sync feature.


### 7/Feb/2026

I found a comment in origina libs of this gay saying he updated to pixi 8. this is the modern so far. 

https://github.com/Untitled-Story/untitled-pixi-live2d-engine

it needs new core version of cubism, donwload from original page, only the core is needed not the rest. but still saving. in the assets/live2d/core all that i donwload from oficial. 

not sure how to call this but something is the border of my characters is not looking good. worked better before, but i noticed more fluent. 
so probably is afeature i dont understand resolution antialiasing or something.

Its pending for me to re understand about resolution and scale. becouse is not always the same.  
aslo before i implement a logic so i can handle the update time. and i used autoupdate:false , so i cantrolled that part. 
but dont remember why?

Ticker.shared.add((ticker: Ticker) => {
      if (this.model && this.model.internalModel) {
        (this.model.internalModel as any).coreModel?.update();
        this.model.update(ticker.deltaTime);
      }
    });

for now i'm using just like the example. 

Probablemente no sea tan complicado manipular el character y puedo hacerlo desde aquí. 


https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/master/src/Live2DModel.ts


Creo que hice el update manual para probar el en playground los movimientos. 
