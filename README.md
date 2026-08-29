# puZZle

Application web progressive (PWA) de puzzle, installable et utilisable hors connexion.

## Lancer localement

Un service worker ne fonctionne pas en ouvrant directement `index.html`. Servez le dossier en HTTP, par exemple :

```sh
python3 -m http.server 8000
```

Ouvrez ensuite `http://localhost:8000` dans votre navigateur.

La page `Accueil.html` permet d’installer l’application ou d’ouvrir directement le jeu.
