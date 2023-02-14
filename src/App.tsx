
import './App.css'
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import WeekTable from './componenetes/tabela';
import Table from './componenetes/tabela';


function App() {

  // moment().week(week).startOf('week').add(i, 'day')
  return (

    <main>
      <div className='topo'>

        <button className='botao'>Antetior</button>
        <button className='botao'>Proximo</button>

      </div>

      <div className='corpo'>
      <Table/>
      </div>
    </main>
  )
}

export default App


// <WeekTable />