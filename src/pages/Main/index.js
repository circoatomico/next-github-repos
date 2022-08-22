import {React, useState, useCallback, useEffect} from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import {Container, Form, SubmitButton, List, DeleteButton} from './style';
import { Link } from 'react-router-dom';

import api from '../../services/api';
export default function Main(){

  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  // Buscar
  useEffect( () => {
    const repoStorage = localStorage.getItem('repos')

    if (repoStorage) {
      setRepositorios( JSON.parse(repoStorage));
    }
  }, [])


  // salvar alterações
  useEffect( () => {
    localStorage.setItem('repos', JSON.stringify(repositorios))
  }, [repositorios])

  function handleinputChange(e) {
    setAlert(null)
    setNewRepo(e.target.value);
  }

  const handleDelete = useCallback( (repo) => {
    const find = repositorios.filter(r => r.name !== repo)

    setRepositorios(find)
  }, [repositorios])

  const handleSubmit = useCallback ( (e) => {

    e.preventDefault()

    async function submit() {

      try{

        if(newRepo === '') {
          throw new Error('Você precisa indicar um repo')
        }

        setLoading(true);
        setAlert(null)

        const response = await api.get(`repos/${newRepo}`)

        const hasRepo = repositorios.find( repo => repo.name === newRepo)

        if (hasRepo) {
          throw new Error('Repo já existe')
        }

        const data = {
          name: response.data.full_name
        }

        setRepositorios([...repositorios, data]);
        setNewRepo('');
      }catch(error) {
        setAlert(error)
        console.log(error)
      }finally {
        setNewRepo('')
        setLoading(false)
        console.log(loading)
      }
    }

    submit();

    console.log(repositorios)

  }, [newRepo, repositorios])

  return(
    <Container>

      <h1>
        <FaGithub size={25}/>
        Meus Repositorios
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input type="text" onChange={handleinputChange} value={newRepo} placeholder="Adicionar Repositorios"/>

        <SubmitButton Loading={loading}>
          {
            loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )
          }
        </SubmitButton>

      </Form>

      <List>
          {repositorios.map(repo => (
            <li key={repo.name}>
              <span>


                <DeleteButton onClick={ () => handleDelete(repo.name) }>
                  <FaTrash size={14} />
                </DeleteButton>
                {repo.name}

              </span>
              <Link to={`/repositorio/${encodeURIComponent(repo.name)}`} >
                <FaBars size={20}/>
              </Link>
            </li>
          ))}
      </List>


    </Container>
  )
}