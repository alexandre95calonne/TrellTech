# PROJET TRELLTECH 

![Epitech Technology](images/logoEpitech.png "Logo EPITECH")

## Table des Matières
- [PROJET TRELLTECH](#projet-trelltech)
  - [Table des Matières](#table-des-matières)
  - [Description](#description)
  - [Équipe](#équipe)
    - [La Gestion](#la-gestion)
  - [Diagrammes UML](#diagrammes-uml)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Développement](#développement)
    - [Production](#production)
    - [Documentation du code](#documentation-du-code)
    - [Contribuer](#contribuer)

## Description

Ce projet est une application mobile développé avec React-Native qui utilise l'API Trello pour afficher les tableaux d'une organisation.

## Équipe

- [Yanis GHERDANE](https://github.com/Yanis23-26)
- [Alexandre CALONNE](https://github.com/alexandre95calonne)

### La Gestion
La gestion du projet et des taches s'est faite de manière collaborative en utilisant Trello et Github Project.

## Diagrammes UML

## Prérequis

Avant de commencer, vous aurez besoin de :

- [Node.js](https://nodejs.org/en) et [npm](https://www.npmjs.com/) installés sur votre machine.
- Un compte [Trello](https://trello.com) avec une clé API et un token.
- [Expo Go](https://expo.dev/go) installé sur votre mobile pour tester l'application sur Android et iOS.
- [Postman](https://www.postman.com/) pour tester les requêtes API.

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
npm build android
npm build ios 
```
Cette commande crée une version optimisé dans le dossier build que vous pouvez deployer dans un serveur de production.

### Documentation du code

La documentation du code est générée avec JSDoc. Vous pouvez la consulter en ouvrant [Documentation]().

### Contribuer

Si vous souhaitez contribuer à ce projet, veuillez consulter le fichier [Contributing](CONTRIBUTING.md) en repectant notre [Code de Conduite](CODE_OF_CONDUCT.md). Nous attendons de tous nos contributeurs qu'ils respectent ce code.
