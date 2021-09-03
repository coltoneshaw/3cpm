import styled from 'styled-components'

export default styled.div`
    overflow: auto;


  table {
    border-spacing: 0;
    background-color: var(--color-background-light);
    color: var(--color-text-lightbackground);
    font-size: .9em;
    min-width: 1200px;
    width: 100%;
    
    .test {
    }

    th,
    td {
      margin: 0;
      padding: 0.3rem .2rem .3rem .2rem;
    }

    thead tr:nth-child(1) th {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: orange;
        padding: 0;
    }

    thead tr:nth-child(2) th {
        position: sticky;
        top: 44px;
        z-index: 100;
    }


    
    tbody{

        tr {
            :nth-child(2n+2) {
                background-color: var(--color-secondary-light87);
            }
    
            :hover {
                background-color: var(--color-secondary-light25);
                color: var(--color-text-darkbackground);

            }
        };

        .pill {
            padding: .1em;
            display: block;
            border-radius: 10px;
            color: white;
            font-weight: 600;
        }



        .red {
            background-color: var(--color-red);
            opacity: var(--opacity-pill);
        }

        .green {
            background-color: var(--color-green);
            opacity: var(--opacity-pill);
        }

        .pill-left {
            border-radius: 10px 0px 0px 10px;
            text-align: right;
            padding-right: 1em;
            border-right: 1px solid white;
        }

        .pill-right {
            border-radius: 0px 10px 10px 0px;
            text-align: left;
            padding-left: 1em;
            height: 100%;
        }
    }


  }
`
