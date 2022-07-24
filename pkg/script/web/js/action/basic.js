
$action["nextview"] = (view) => {
    view_next(view);
};

$action["resetview"] = () => {
    view_reset();
};

$action["newgame"] = (slot) => {
    $view.slot = slot;
    newgame();
};

$action["loadgame"] = (slot) => {
    $view.slot = slot;
    loadgame();
};

$action["savegame"] = () => {
    savegame();
};
