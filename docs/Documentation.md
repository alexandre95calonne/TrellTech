## Documentation Technique TrellTech

# Introduction

Ce projet est une application mobile développée avec React Native. Il permet la gestion d'organisations et de tableaux Trello, incluant la création, la mise à jour et la suppression d'organisations, de tableaux, et de listes.

# Structure du Projet

Le projet est structuré en trois écrans principaux :

HomeScreen: Gère les organisations.
OrganizationBoardsScreen: Affiche les tableaux d'une organisation.
BoardListsScreen: Montre les listes associées à un tableau.
Fonctionnalités Clés
Gestion des Organisations: Création, mise à jour, et suppression d'organisations.
Gestion des Tableaux: Affichage, création, mise à jour, et suppression de tableaux au sein d'une organisation.
Gestion des Listes: Affichage, création, mise à jour, et suppression de listes dans un tableau.

# Dépendances Externes

axios: Utilisé pour les requêtes HTTP à l'API Trello.
react-navigation: Gère la navigation entre les différents écrans de l'application.

# Installation

Clonez le repository git.
Exécutez npm install pour installer les dépendances.
Lancez l'application avec npx react-native run-android ou npx react-native run-ios.

# Utilisation

HomeScreen: L'écran d'accueil liste toutes les organisations disponibles. Vous pouvez en créer de nouvelles, les modifier ou les supprimer.
OrganizationBoardsScreen: Sélectionnez une organisation pour voir ses tableaux. Vous pouvez également ajouter, éditer ou supprimer des tableaux.
BoardListsScreen: En sélectionnant un tableau, vous accéderez aux listes qu'il contient. Il est possible de créer, éditer ou supprimer des listes.

# Conclusion

Cette documentation technique fournit un aperçu de la structure et des fonctionnalités de l'application. Pour plus de détails, référez-vous au code source des différents écrans.
