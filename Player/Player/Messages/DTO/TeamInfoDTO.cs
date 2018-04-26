using System.Collections.Generic;

namespace Player.Messages.DTO
{
    public class TeamInfoDTO
    {
        /**
        NOTE: in general it would be beneficial to create a new type alias for PlayerIDs

        This way a situation where we revert back to ints as IDs would mean little to no refactoring
        since it would just be changed in one place.

        See https://stackoverflow.com/a/9258058/4874344 for more information.
         */
        public IList<string> Players;
        public string LeaderId;
    }
}
