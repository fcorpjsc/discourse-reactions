import { h } from "virtual-dom";
import { createWidget } from "discourse/widgets/widget";
import { avatarFor } from "discourse/widgets/post";

export default createWidget("discourse-reactions-state-panel", {
  tagName: "div.discourse-reactions-state-panel",

  buildKey: attrs => `discourse-reactions-state-panel-${attrs.post.id}`,

  mouseOut() {
    if (!this.capabilities.touch) {
      this.callWidgetFunction("scheduleCollapse");
    }
  },

  mouseOver() {
    if (!this.capabilities.touch) {
      this.callWidgetFunction("cancelCollapse");
    }
  },

  onChangeDisplayedReaction(reactionId) {
    this.state.displayedReactionId = reactionId;
  },

  defaultState(attrs) {
    return {
      displayedReactionId:
        attrs.post.reactions && attrs.post.reactions.length
          ? attrs.post.reactions.sortBy("count").reverse().firstObject.id
          : null
    };
  },

  html(attrs) {
    if (!attrs.statePanelExpanded) return;
    if (!attrs.post.reactions.length) return;

    const sortedReactions = attrs.post.reactions.sortBy("count").reverse();

    const displayedReaction =
      attrs.post.reactions.findBy("id", this.state.displayedReactionId) ||
      sortedReactions.firstObject;

    return [
      ,
      h("div.container", [
        h(
          "div.users",
          displayedReaction.users.map(user =>
            avatarFor("tiny", {
              username: user.username,
              template: user.avatar_template
            })
          )
        ),
        h(
          "div.counters",
          sortedReactions.map(reaction =>
            this.attach("discourse-reactions-state-panel-reaction", {
              reaction,
              isDisplayed: reaction.id === this.state.displayedReactionId
            })
          )
        )
      ])
    ];
  }
});
