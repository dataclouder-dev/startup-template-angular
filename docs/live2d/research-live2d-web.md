Here is my research. 


Live 2d is a company from japan, they created cubism the technology to render 2d models : https://github.com/Live2D


cubism is the technology to render 2d models, and is divided in 2 projects. 

- Core : baremetals of the technology. This is only downloadable from web, i think is not open source. 
- Framework: you can find this in github. This is the open source version of cubism. but depends on core.



I see two important repositories:

Framework: 
It have been in version 5 for 2 years, still in beta not even final release until this writing. 

https://github.com/Live2D/CubismWebFramework

This in order to understand how they use the technology.

https://github.com/Live2D/CubismWebSamples







### Aihi

This is the project closer to what we want to achieve.

https://github.com/moeru-ai/airi

https://github.com/moeru-ai/airi/blob/main/packages/stage-ui-live2d/package.json



### Problem 

Cubism is not friendly, but documentation, looks like they dont want to share the technology.

Some one created this project to solve this problem:

https://github.com/guansss/pixi-live2d-display

but author never updated it to pixi 8. 

So some one forked it and updated to pixi 8 and also he add and important feature, that exits in the official framework, but not the the original library the lip sync. 

https://github.com/RaSan147/pixi-live2d-display

so i'm using this. 


but i found last update is this one.
https://github.com/Untitled-Story/untitled-pixi-live2d-engine?tab=readme-ov-file