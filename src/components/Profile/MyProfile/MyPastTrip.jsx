import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import PostProfile from '../../../components/Profile/PostProfile';
import { useSelector } from 'react-redux';
import { Card, Placeholder, Spinner } from 'react-bootstrap';

const PostProfileMemo = React.memo(PostProfile);

function MyPastTrips() {
    const [posts, setPosts] = useState([]);

    const dataProfile = useSelector(state => state.profile);
    console.log('posts', posts);


    // Chỉ setPosts khi dataProfile.trip có dữ liệu hợp lệ
    useEffect(() => {
        if (dataProfile?.trip?.$values && Array.isArray(dataProfile.trip.$values)) {
            setPosts(dataProfile.trip.$values);
        }
    }, [dataProfile]);  // Chạy lại khi dataProfile thay đổi

    return (
        <Container className='border-0 rounded-5'>
            {posts.length > 0 ? (
                posts.map(post => (
                    <PostProfileMemo key={post.id} {...post} />
                ))
            ) : (
                <div className=''>
                    <div className='shadow px-5 py-4 rounded-4 mb-2' style={{ height: 'auto' }}>
                        <div className='d-flex justify-content-between'>
                            {/* Avatar and Name */}
                            <div className='d-flex gap-2 mb-2'>
                                <Placeholder as="div" animation="glow">
                                    <Placeholder style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                </Placeholder>
                                <div>
                                    <Placeholder as="p" animation="glow">
                                        <Placeholder xs={6} />
                                    </Placeholder>
                                    <Placeholder as="small" animation="glow">
                                        <Placeholder xs={4} />
                                    </Placeholder>
                                </div>
                            </div>
                            {/* Dropdown Placeholder */}
                            <Placeholder as="div" animation="glow">
                                <Placeholder style={{ width: '20px', height: '20px' }} />
                            </Placeholder>
                        </div>

                        {/* Caption */}
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={8} />
                            <Placeholder xs={10} />
                        </Placeholder>

                        {/* Images Placeholder */}
                        <div className='d-flex flex-wrap'>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Placeholder key={index} as="div" animation="glow" style={{ margin: '5px' }}>
                                    <Placeholder style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
                                </Placeholder>
                            ))}
                        </div>

                        {/* Comment Section Placeholder */}
                        <div className='d-flex gap-2 mt-3'>
                            <Placeholder as="div" animation="glow">
                                <Placeholder style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                            </Placeholder>
                            <div>
                                <Placeholder as="p" animation="glow">
                                    <Placeholder xs={4} />
                                </Placeholder>
                                <Placeholder as="p" animation="glow">
                                    <Placeholder xs={8} />
                                    <Placeholder xs={6} />
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
}

export default MyPastTrips;
