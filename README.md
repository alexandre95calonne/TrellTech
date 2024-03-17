# PROJET TRELLTECH 

## Description

Ce projet est une application mobile développé avec React-Native qui utilise l'API Trello pour afficher les tableaux d'une organisation.


## Prérequis

Avant de commencer, vous aurez besoin de :

- Node.js et npm installés sur votre machine.
- Un compte Trello avec une clé API et un token.
- Expo CLI pour tester l'application sur Android et iOS.
- Postman pour tester les requêtes API.

## Installation

1. Clonez ce dépôt.
2. Installez les dépendances avec `npm install` ou `npm i`.
3. Créez un fichier `.env` à la racine du projet et ajoutez vos clés d'API Trello (la clé API et le Token).

## Développement

Pour lancer le projet en mode développement, utilisez la commande suivante :
```bash
npm start
```

### Production 

Pour construire le projet pour la production, utilisez la commande suivante : 
```bash
npm build android # pour Android
npm build ios # pour IOS
```
Cette commande crée une version optimisé dans le dossier build que vous pouvez deployer dans un serveur de production.

### Documentation du code

La documentation du code est générée avec JSDoc. Vous pouvez la consulter en ouvrant [documentation]().

### Contribuer

Si vous souhaitez contribuer à ce projet, veuillez consulter le fichier [CONTRIBUTING](CONTRIBUTING.md).