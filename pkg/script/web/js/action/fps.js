
define_action("fpsmove", (self, lstick, rstick) => {
  const moveXY = com_value(lstick);
  const cameraXY = com_value(rstick);
  mob_fps_movement(self, moveXY, cameraXY);
});
