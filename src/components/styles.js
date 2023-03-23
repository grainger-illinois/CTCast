import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
    appBar: {
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',

        
      },
      heading: {
        color: 'rgba(0,183,255, 1)',
      },
      image: {
        marginLeft: '15px',
      },
    a: {
      color: 'rgba(255,255,255, 255)'
      },
      button:{
        textDecorationColor: 'rgba(255,255,255, 255)',
        color: 'rgba(255,255,255, 255)'
      }

}));