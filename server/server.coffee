Meteor.startup ->
    if Innovation.find().count() is 0
        ctc.AddCsvToCollection "data.csv", Innovation, (jsonArray) ->
            console.log "fetch parkings: "
            console.log Innovation.find().fetch()
