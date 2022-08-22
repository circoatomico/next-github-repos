import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import api from "../../services/api";
import { FaArrowLeft } from 'react-icons/fa'
import { BackButton, Container, IssuesList, IssuesStates, Loading, Owner, PageActions } from "./styles";

export default function Repositorio() {

    let {repositorio} = useParams();

    const [repoData, setRepositorio] = useState({});
    const [issuesData, setIssues] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1)
    const [issueState, setIssueState] = useState('open')

    useEffect( () => {

        async function load() {

            const nomeRepo = decodeURIComponent(repositorio)

            const [repo, issues] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }
                })
            ])

            setRepositorio(repo.data)
            setIssues(issues.data)
            setLoading(false)

        }

        load();


    }, [])

    useEffect( () => {
        async function loadIssue() {
            const nomeRepo = decodeURIComponent(repositorio)

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: issueState,
                    page,
                    per_page: 5,
                }
            })

            setIssues(response.data);

        }

        loadIssue()
    },[repositorio, issueState, page])

    function handlePage(action) {
        setPage( action === 'back' ? page - 1 : page + 1)
    }

    if (loading) {
        return(
            <Loading>
                <h1>Carregando</h1>
            </Loading>
        )
    }

    return(
        <Container>

            <BackButton to="/">
                <FaArrowLeft color="#FFF" size={30} />
            </BackButton>

            <Owner>
                <img
                    src={repoData.owner.avatar_url}
                    alt={repoData.owner.login}
                >
                </img>
                <p>{repoData.name}</p>
                <p>{repoData.description}</p>
            </Owner>

            <IssuesStates>
                <button disabled={issueState === 'open'} type="button" onClick={ () => setIssueState('open') }>open</button>
                <button disabled={issueState === 'closed'} type="button" onClick={ () => setIssueState('closed') }>closed</button>
                <button disabled={issueState === 'all'} type="button" onClick={ () => setIssueState('all') }>all</button>
            </IssuesStates>

            <IssuesList>
                {issuesData.map(issue => (
                    <li key={String(issue.id)}>
                        <img
                            src={issue.user.avatar_url}
                            alt={issue.user.login}
                        />

                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map (label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>

            <PageActions>
                <button
                    disabled={page < 2}
                    type="button"
                    onClick={() => handlePage('back')}
                >
                    Voltar
                </button>
                <button type="button" onClick={() => handlePage('next')}>Próxima</button>
            </PageActions>
        </Container>
    )

}