
$action["nextview"] = (view) => {
    next_view(view);
};

$action["resetview"] = () => {
    reset_view();
};

$action["newgame"] = (slot) => {
    $temp.slot = slot;
    newgame();
};

$action["loadgame"] = (slot) => {
    $temp.slot = slot;
    loadgame();
};

$action["savegame"] = () => {
    savegame();
};
