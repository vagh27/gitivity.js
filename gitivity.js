
var yourID = "vagh27"

var Gitivity = {
    Models: {},
    Collections: {},
    Views: {},
    Templates:{}
}

Gitivity.Models.Movie = Backbone.Model.extend({})
Gitivity.Collections.Movies = Backbone.Collection.extend({
    model: Gitivity.Models.Movie,
    url: "https://api.github.com/users/"+yourID+"/events/public",
    //url: "scripts/data/test.json",
    initialize: function(){
        console.log("initialize collection")
    }
});

Gitivity.Templates.activities = _.template($("#tmplt-Activities").html())

Gitivity.Views.Activities = Backbone.View.extend({
    el: $("#container"),
    template: Gitivity.Templates.activities,
    initialize: function () {
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", this.addOne, this);
    },
    render: function () {
        console.log("render")
        console.log(this.collection.length);
        $(this.el).html(this.template());
        this.addAll();
    },
    addAll: function () {
        //console.log(this.collection)
        var allData = this.collection.toJSON();
        //this.collection.each(this.addOne);
        for(var i=0; i < allData.length; i++){
            var currentData = allData[i],
                dateParse = new Date(allData[i].created_at),
                currentDayofMonth = dateParse.getDate(),
                currentDayofWeek = dateParse.getDay(),
                currentMonth = dateParse.getMonth(),
                url = null;

            if(currentData.type == 'PushEvent'){
                url = "https://github.com/"+currentData.repo.name+"/commit/"+currentData.payload.head;
            }

            //so we're passing a bunch of stuff, including currentData as a model, just so we have it
            //all this 'stuff' is pretty much to avoid having to add lots of 'if' statements in the template
            this.addOne(currentData,currentDayofWeek,currentDayofMonth,url)
        }
    },
    addOne: function (activity,currentDayofWeek,currentDayofMonth,url) {
        view = new Gitivity.Views.Activity({ model: activity, currentDayofWeek:currentDayofWeek, currentDayofMonth:currentDayofMonth, url:url });
        $("ul", this.el).append(view.render());
    }

})


Gitivity.Templates.activity = _.template($("#tmplt-Activity").html())
Gitivity.Views.Activity = Backbone.View.extend({
    tagName: "li",
    template: Gitivity.Templates.activity,
    initialize: function () {
        //this.model.bind('destroy', this.destroyItem, this);
    },
    render: function () {
        console.log(this.options)
        return $(this.el).append(this.template({model:this.model, extra:this.options})) ;
    }
})


Gitivity.activities = new Gitivity.Collections.Movies()
new Gitivity.Views.Activities({ collection: Gitivity.activities }); 
Gitivity.activities.fetch();
