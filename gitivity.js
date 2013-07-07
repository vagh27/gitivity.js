
var yourID = "vagh27"

var Gitivity = {
    Models: {},
    Collections: {},
    Views: {},
    Templates:{}
}

//define templates
Gitivity.Templates.activities = _.template($("#tmplt-Activities").html())
Gitivity.Templates.activity = _.template($("#tmplt-Activity").html())


Gitivity.Models.Activity = Backbone.Model.extend({})

Gitivity.Collections.Activities = Backbone.Collection.extend({
    model: Gitivity.Models.Activity,
    //url: "https://api.github.com/users/"+yourID+"/events/public",
    url: "scripts/data/test.json",
    initialize: function(){
        console.log("initialize collection")
    }
});



Gitivity.Views.Activities = Backbone.View.extend({
    el: $("#container"),
    template: Gitivity.Templates.activities,
    initialize: function () {
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", this.addOne, this);
    },
    render: function () {
        //console.log("render")
        //console.log(this.collection.length);
        this.addAll();
    },
    addAll: function () {
        //console.log(this.collection)
        var allData = this.collection.toJSON();
        //this.collection.each(this.addOne);

        //get first day
        var currentSet = new Date(allData[0].created_at);
            currentDayofSet = currentSet.getDate(),
            currentMonth = currentSet.getMonth();
        $(this.el).html(this.template({ currentDayofMonth:currentDayofSet, currentMonth:currentMonth }));

        for(var i=0; i < allData.length; i++){
            var currentData = allData[i],
                dateParse = new Date(allData[i].created_at),
                currentDayofMonth = dateParse.getDate(),
                currentDayofWeek = dateParse.getDay(),
                currentMonth = dateParse.getMonth(),
                url = null,
                startNewDay = false;

            //alert(currentDayofSet + " "+ currentDayofMonth)

            //create a new day ul if the current day does not match the previous day
            var dayDiff = currentDayofSet-currentDayofMonth;
            if (currentDayofSet != currentDayofMonth){ 
                if( dayDiff != 1  ){
                    for(var a=1; a < dayDiff; a++){
                        var tempDay = currentDayofSet - a;
                        $(this.el).append(this.template({ currentDayofMonth:tempDay, currentMonth:currentMonth }));
                    }
                }
                $(this.el).append(this.template({ currentDayofMonth:currentDayofMonth, currentMonth:currentMonth })); 
            }

            currentDayofSet = currentDayofMonth;


            if(currentData.type == 'PushEvent'){
                url = "https://github.com/"+currentData.repo.name+"/commit/"+currentData.payload.head;
            }

            //so we're passing a bunch of stuff, including currentData as a model, just so we have it
            //all this 'stuff' is pretty much to avoid having to add lots of 'if' statements in the template
            this.addOne(currentData,currentMonth,currentDayofMonth,url,startNewDay)
        }
    },
    addOne: function (activity,currentMonth,currentDayofMonth,url,startNewDay) {
        view = new Gitivity.Views.Activity({ model: activity, currentMonth:currentMonth, currentDayofMonth:currentDayofMonth, url:url, startNewDay:startNewDay });
        
        $("ul.d"+currentDayofMonth, this.el).append(view.render());
    }

})



Gitivity.Views.Activity = Backbone.View.extend({
    tagName: "li",
    template: Gitivity.Templates.activity,
    initialize: function () {
        //this.model.bind('destroy', this.destroyItem, this);
    },
    render: function () {
        //console.log(this.options)
        return $(this.el).append(this.template({model:this.model, extra:this.options})) ;
    }
})


Gitivity.activities = new Gitivity.Collections.Activities()
new Gitivity.Views.Activities({ collection: Gitivity.activities }); 
Gitivity.activities.fetch();
