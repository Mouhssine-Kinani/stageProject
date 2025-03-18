# Gestion des Contrats (Syntara)

Une application web pour la gestion des contrats de l'agence.

---

## Table des Matières

- [Gestion des Contrats (Syntara)](#gestion-des-contrats-syntara)
  - [Table des Matières](#table-des-matières)
  - [Présentation](#présentation)
  - [Technologies Utilisées](#technologies-utilisées)
  - [Fonctionnalités](#fonctionnalités)
  - [Installation et Configuration](#installation-et-configuration)
  - [Exécution du Projet](#exécution-du-projet)
  - [Documentation de l'API](#documentation-de-lapi)
    - [Routes Principales](#routes-principales)
      - [1. **Routes Générales**](#1-routes-générales)
      - [2. **Fournisseurs (Providers)**](#2-fournisseurs-providers)
      - [3. **Produits**](#3-produits)
      - [4. **Clients**](#4-clients)
      - [5. **Utilisateurs**](#5-utilisateurs)
      - [6. **Authentification**](#6-authentification)
  - [Structure du Projet](#structure-du-projet)
  - [Contribuer](#contribuer)
  - [Licence](#licence)
  - [Contact](#contact)

---

## Présentation

Cette application a pour but de gérer les contrats de l'agence. Elle intègre un système d'authentification, des opérations CRUD conditionnées par le rôle de l'utilisateur et une API de réinitialisation de mot de passe.

---

## Technologies Utilisées

- **Frontend:** Next.js, TailwindCSS (optionnel)
- **Backend:** Node.js, Express.js
- **Base de données:** MongoDB
- **Authentification:** JWT
- **Autres outils:** Docker, pnpm

---

## Fonctionnalités

- **Authentification Utilisateur :** Inscription, connexion et réinitialisation de mot de passe.
- **Opérations CRUD :** Création, lecture, mise à jour et suppression des contrats, fournisseurs, produits, clients, etc. (selon le rôle de l'utilisateur).
- **Reset API :** Gestion de la réinitialisation de mot de passe via email.

---

## Installation et Configuration

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/grandecharte/Syntara.git
   ```

2. **Installer les dépendances :**

   - **Backend :**

     ```bash
     cd backend
     pnpm install  # ou npm install
     ```

   - **Frontend (UI) :**
     ```bash
     cd ../ui
     pnpm install  # ou npm install
     ```

3. **Configuration de l'environnement :**

   Un fichier `.env.example` est déjà présent. Copiez-le en `.env` et ajustez les variables selon vos besoins.

---

## Exécution du Projet

Pour lancer le projet, ouvrez **deux terminaux** :

- **Terminal 1 (Backend) :**

  ```bash
  cd backend
  pnpm dev
  ```

- **Terminal 2 (Frontend) :**
  ```bash
  cd ui
  pnpm dev
  ```

---

## Documentation de l'API

### Routes Principales

#### 1. **Routes Générales**

- **GET /**  
  Retourne « Hello World » pour tester la connectivité.

#### 2. **Fournisseurs (Providers)**

- **POST /providers/create**  
  Création d’un fournisseur (Admin et Super Admin uniquement, upload d’un logo).
- **GET /providers**  
  Récupération de tous les fournisseurs (accessible aux utilisateurs authentifiés).
- **DELETE /providers/delete/:id**  
  Suppression d’un fournisseur (Admin et Super Admin uniquement).
- **GET /providers/edit/:id**  
  Affichage de la page d’édition d’un fournisseur (Admin et Super Admin uniquement).
- **PUT /providers/edit/:id**  
  Mise à jour d’un fournisseur (Admin et Super Admin uniquement).

#### 3. **Produits**

- **POST /products/create**  
  Création d’un produit (Admin et Super Admin uniquement).
- **GET /products**  
  Récupération de tous les produits (accessible aux utilisateurs authentifiés).
- **GET /products/stats**  
  Statistiques sur les produits (accessible aux utilisateurs authentifiés).
- **DELETE /products/delete/:id**  
  Suppression d’un produit (Admin et Super Admin uniquement).
- **GET /products/edit/:id**  
  Affichage de la page d’édition d’un produit (Admin et Super Admin uniquement).
- **PUT /products/edit/:id**  
  Mise à jour d’un produit (Admin et Super Admin uniquement).

#### 4. **Clients**

- **POST /clients/create**  
  Création d’un client (Admin et Super Admin uniquement, upload d’un logo).
- **GET /clients**  
  Récupération de tous les clients (accessible aux utilisateurs authentifiés).
- **GET /clients/count**  
  Récupération du nombre de clients (accessible aux utilisateurs authentifiés).
- **GET /clients/:id**  
  Récupération d’un client par son ID (accessible aux utilisateurs authentifiés).
- **DELETE /clients/delete/:id**  
  Suppression d’un client (Admin et Super Admin uniquement).
- **GET /clients/edit/:id**  
  Affichage de la page d’édition d’un client (Admin et Super Admin uniquement).
- **PUT /clients/edit/:id**  
  Mise à jour d’un client (Admin et Super Admin uniquement).
- **DELETE /clients/:clientId/product/:productId**  
  Suppression d’un produit d’un client (Admin et Super Admin uniquement).

#### 5. **Utilisateurs**

- **GET /users/**  
  Récupération de tous les utilisateurs (accessible aux utilisateurs authentifiés).
- **GET /users/:id**  
  Récupération d’un utilisateur par son ID (accessible aux utilisateurs authentifiés).
- **POST /users/create**  
  Création d’un utilisateur (Admin et Super Admin uniquement, upload d’un logo).
- **PUT /users/:id**  
  Mise à jour d’un utilisateur (Admin et Super Admin uniquement).
- **DELETE /users/:id**  
  Suppression d’un utilisateur (Admin et Super Admin uniquement).

#### 6. **Authentification**

- **POST /auth/signup**  
  Inscription d’un nouvel utilisateur.
- **POST /auth/signin**  
  Connexion d’un utilisateur existant.
- **POST /auth/forgot-password**  
  Demande de réinitialisation de mot de passe (envoi d’un email avec lien de réinitialisation).
- **POST /auth/reset-password**  
  Réinitialisation du mot de passe à l’aide du token.

---

## Structure du Projet

```
/backend
  ├── config
  ├── controllers
      ├── Auth
      ├── Users
      ├── providers
      ├── Products
      └── clients
  ├── middleware
  ├── routes
      ├── Auth
      ├── Users
      ├── providers
      ├── Products
      └── clients
  ├── server.js
  └── config/env.js
/ui
  ├── components
  ├── pages
  ├── styles
  └── ...
```

---

## Contribuer

Les contributions sont les bienvenues. Merci de cloner le dépôt, créer une branche pour votre fonctionnalité et soumettre une pull request.

---

## Licence

Ce projet est sous licence [MIT](LICENSE).

---

## Contact

- **GitHub:** [grandecharte](https://github.com/grandecharte)
- Pour toute question ou suggestion, n'hésitez pas à me contacter.
