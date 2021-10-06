import styled from 'styled-components'

export default styled.div`
    overflow: auto;


  .table {
    border-spacing: 0;
    background-color: var(--color-background-light);
    color: var(--color-text-lightbackground);
    font-size: .9em;
    display: block;
    overflow: auto;

    .th,
    .td {
      margin: 0;
      padding: 0.3rem .2rem .3rem .2rem;
    }

    .thead .tr:nth-child(1) {
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 0;
        text-align: center !important;
    }


    
    .tbody{



        .tr[role=row] {
            :nth-child(2n+2) {
                background-color: var(--color-secondary-light87);
            }
    
            :hover {
                background-color: var(--color-secondary-light25);
                color: var(--color-text-darkbackground);

            }
        };

        .pill {
            padding: .2em;
            display: block;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            white-space: nowrap;
            width: 90%;
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
            margin-right: 2px;
        }

        .pill-right {
            border-radius: 0px 10px 10px 0px;
            text-align: left;
            padding-left: 1em;
        }
    }


  }
`
