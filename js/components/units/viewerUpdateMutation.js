import Relay from 'react-relay'


export default class Viewer_updateMutation extends Relay.Mutation
{
  static fragments = {
    Viewer: () => Relay.QL `
      fragment on Viewer {
        id,
      }
    `,
  }
  getMutation()
  {
    return Relay.QL `mutation{viewerUpdate}`
  }
  getFatQuery()
  {
    return Relay.QL `
      fragment on Viewer_updatePayload {
        Viewer {
          lang,
          intl {
              id,
              message,
          },
        }
      }
    `
  }
  getConfigs()
  {
    return [
    {
      type: 'FIELDS_CHANGE',
      fieldIDs:
      {
        Viewer: this.props.Viewer.id,
      },
    } ]
  }
  getVariables()
  {
    return {
      id: this.props.Viewer.id,
      lang: this.props.lang,
    }
  }
  getOptimisticResponse()
  {
    return {
      Viewer:
      {
        id: this.props.Viewer.id,
        lang: this.props.lang,
      },
    }
  }
}
