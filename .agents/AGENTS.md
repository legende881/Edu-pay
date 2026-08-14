# Règles de mise à jour du fichier de passation

<RULE[gemini_auto_update]>
Mise à jour automatique de la documentation de passation :
À chaque fois que vous effectuez une modification significative dans le projet (nouvelle fonctionnalité, refonte de design, modification d'architecture, etc.), vous DEVEZ OBLIGATOIREMENT mettre à jour le fichier `gemini.md` situé à la racine du projet. 
Ce fichier sert de dossier de passation pour les prochaines instances d'IA. Il doit toujours refléter exactement ce qui a été fait, les fonctionnalités présentes, les technologies utilisées et les décisions de design. Ne demandez pas la permission, mettez-le à jour automatiquement à la fin de vos modifications.
</RULE[gemini_auto_update]>

<RULE[database_first]>
Toutes les modifications et mises à jour effectuées sur l'application doivent être directement prises en compte dans la base de données (Supabase) immédiatement. Ne vous reposez plus sur le state local (`localStorage`) et ne demandez pas la permission à l'utilisateur avant d'implémenter les requêtes de base de données. L'application doit systématiquement lire et écrire dans la base de données.
</RULE[database_first]>
