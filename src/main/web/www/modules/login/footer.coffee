'use strict'

define ["avalon", "text!./footer.html"], (avalon, footerhtml) ->
  avalon.define({
    $id: "loginfooterid"
  })

  avalon.templateCache.loginfooter = footerhtml

  return
#  loadpage: () ->
#    avalon.templateCache.loginfooter = footerhtml
#    return
#
#  leavepage: () ->
#    avalon.templateCache.loginfooter = Utils.emptydiv
#    return

