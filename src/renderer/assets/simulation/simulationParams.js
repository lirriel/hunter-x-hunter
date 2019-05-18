export let simulationParams = {
    preyLifespan: 60,
    preyAdulthoodAge: 2,
    preyBirthPeriod: 2,

    predatorLifespan: 100,
    predatorAdulthoodAge: 5,
    predatorBirthPeriod: 1,
    predatorFeedPreyCount: 2,

    hungerSteps: 8,

    isAliveProbability: 0.4,
    isPredatorProbability: 0.2,
    isHumanProbability: 0.01,
    isHumanRequired: true,
    killPredatorPriority: 0.2,
    killPreyPriority: 0.1,
    killRange: 12,
    noticeOrganismRange: 20,
    preyNeedLimit: 10,
    preyNeedStepsLimit: 12,

    width: 20,
    height: 20,
};
