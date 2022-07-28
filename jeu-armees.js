const armees = [
    {ID: 1, camp: 0, x: 2, y: 3, force: 1},
    {ID: 0, camp: 0, x: 2, y: 2, force: 2},
    {ID: 2, camp: 1, x: 4, y: 3, force: 2},
];

const deplacements = [
    {IDArmee: 1, xDestination: 3, yDestination: 3},
    {IDArmee: 0, xDestination: 4, yDestination: 2},
    {IDArmee: 2, xDestination: 3, yDestination: 3},
];

/**
 * Résout un tour de jeu: déplace les armées (déplacement autorisé) puis résout les combats
 * et retourne uniquement les armées victorieuses.
 *
 * @param {{ID: {Number}, camp: {Number}, x: {Number}, y: {Number}, force: {Number}}[]} armees
 * @param {{IDArmee: {Number}, xDestination: {Int}, yDestination: {Number}}[]} deplacements
 * @returns {{ID: {Number}, camp: {Number}, x: {Number}, y: {Number}, force: {Number}}[]}
 */
function tour(armees, deplacements) {
    // par défaut, on ne met aucune armée dans retourArmees: on le remplira avec les vainqueurs
    let retourArmees = [];

    // retourne l'armée possédant d'ID demandé (undefined sinon)
    const getArmeeByID = (id) => armees.find(a => a.ID === id);

    /**
     * @param {Object} deplacement
     * @param {Number} deplacement.IDArmee
     * @param {Number} deplacement.xDestination
     * @param {Number} deplacement.yDestination
     * @returns {boolean} true si le déplacement ne dépasse pas 1 case dans chaque direction X / Y
     */
    const isDeplacementAllowed = function (deplacement) {
        const armee = getArmeeByID(deplacement.IDArmee);
        if (deplacement.xDestination < armee.x - 1 || deplacement.xDestination > armee.x + 1) return false;
        if (deplacement.yDestination < armee.y - 1 || deplacement.yDestination > armee.y + 1) return false;
        return true;
    };

    /**
     * résout une "bataille" à partir de son lieu en utilisant le mapping des armées par camp et par lieu
     *
     * @param {String} locationStr  Un lieu sous la forme "x:y"
     * @returns {Number}  Le camp ayant remporté le combat
     */
    const doBattle = function (locationStr) {
        // note: doBattle s'exécute même lorsqu'il n'y a qu'un seul camp représenté (forcément vainqueur du coup)
        const armeeByCamp = armeeByLocation[locationStr];
        let force0 = armeeByCamp[0].reduce((f, a) => f + a.force, 0);
        let force1 = armeeByCamp[1].reduce((f, a) => f + a.force, 0);
        let loser = 0 + (force0 >= force1);
        let victor = 0 + (!loser);

        // on ne met dans retourArmees que les vainqueurs; “vae victis” comme dirait l'autre
        retourArmees.push(...armeeByCamp[victor]);
        return victor; // on ne se sert pas de cette valeur de retour mais ça pourrait servir plus tard
    }

    // déplacement des armées:
    deplacements.forEach((deplacement) => {
        const armee = getArmeeByID(deplacement.IDArmee);
        if (isDeplacementAllowed(deplacement)) {
            armee.x = deplacement.xDestination;
            armee.y = deplacement.yDestination;
        }
    });

    // regroupement par localisation
    const armeeByLocation = armees.reduce(
        /**
         *
         * @param {Object} abl  Mapping en construction: regroupe les armées par camp et par lieu
         * @param {Object} armee
         * @returns {{}}
         */
        (abl, armee) => {
            const locationStr = `${armee.x}:${armee.y}`;
            abl[locationStr] = abl[locationStr] || {0: [], 1: []};
            abl[locationStr][armee.camp].push(armee);
            return abl;
        },
        {}
    );

    Object.keys(armeeByLocation).forEach(doBattle);

    // résolution des combats et tri par force descendante
    return retourArmees.sort((armeeA, armeeB) => armeeB.force - armeeA.force);
}

let ret = tour(armees, deplacements);

console.log(ret);
